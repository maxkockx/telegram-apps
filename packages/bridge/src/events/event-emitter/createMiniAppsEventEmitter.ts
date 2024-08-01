import { EventEmitter as GenericEventEmitter } from '@telegram-apps/event-emitter';
import { boolean, json, number, string } from '@telegram-apps/parsing';

import { onWindow } from '@/events/onWindow.js';
import { error } from '@/debug.js';
import { createCleanup } from '@/utils/createCleanup.js';
import { removeEventHandlers, defineEventHandlers } from '@/events/handlers.js';
import type { EventName, EventPayload, EventEmitter, Events } from '@/events/types.js';

/**
 * Parsers for problematic Mini Apps events.
 */
const parsers: {
  [E in EventName]?: {
    parse(value: unknown): EventPayload<E>;
  }
} = {
  clipboard_text_received: json({
    req_id: string(),
    data: (value) => (value === null ? value : string().optional().parse(value)),
  }),
  custom_method_invoked: json({
    req_id: string(),
    result: (value) => value,
    error: string().optional(),
  }),
  popup_closed: {
    parse(value) {
      return json({
        button_id: (value) => (
          value === null || value === undefined
            ? undefined
            : string().parse(value)
        ),
      }).parse(value ?? {});
    },
  },
  viewport_changed: json({
    height: number(),
    width: (value) => (
      value === null || value === undefined
        ? window.innerWidth
        : number().parse(value)
    ),
    is_state_stable: boolean(),
    is_expanded: boolean(),
  }),
};

/**
 * Creates new event emitter, which handles events from the Telegram application.
 */
export function createMiniAppsEventEmitter(): [
  /**
   * Created event emitter.
   */
  emitter: EventEmitter,
  /**
   * Function to dispose created emitter.
   */
  dispose: () => void,
] {
  // We use this event emitter for better developer experience, using the subscribe method.
  const subEmitter = new GenericEventEmitter<{ event: any[] }>();

  // Event emitter processing all the incoming events.
  const mainEmitter = new GenericEventEmitter<Events>();

  mainEmitter.subscribe(event => {
    subEmitter.emit('event', { name: event.event, payload: event.args[0] });
  });

  // Define event handles, which will proxy native method calls to their web version.
  defineEventHandlers();

  // List of cleanup functions, which should be called on dispose.
  const [, cleanup] = createCleanup(
    // Don't forget to remove created handlers.
    removeEventHandlers,
    // Add "resize" event listener to make sure, we always have fresh viewport information.
    // Desktop version of Telegram is sometimes not sending the viewport_changed
    // event. For example, when the MainButton is shown. That's why we should
    // add our own listener to make sure, viewport information is always fresh.
    // Issue: https://github.com/Telegram-Mini-Apps/telegram-apps/issues/10
    onWindow('resize', () => {
      mainEmitter.emit('viewport_changed', {
        width: window.innerWidth,
        height: window.innerHeight,
        is_state_stable: true,
        is_expanded: true,
      });
    }),
    // Add listener, which handles events sent from the Telegram web application and also events
    // generated by the local emitEvent function.
    onWindow('message', (event) => {
      // Ignore non-parent window messages.
      if (event.source !== window.parent) {
        return;
      }

      // Parse incoming event data.
      let message: { eventType: string; eventData?: unknown };
      try {
        message = json({
          eventType: string(),
          eventData: (v) => v,
        }).parse(event.data);
      } catch {
        // We ignore incorrect messages as they could be generated by any other code.
        return;
      }

      const { eventType, eventData } = message;
      const parser = parsers[eventType as keyof typeof parsers];

      try {
        const data = parser ? parser.parse(eventData) : eventData;
        mainEmitter.emit(...(data ? [eventType, data] : [eventType]) as [any, any]);
      } catch (cause) {
        error(
          `An error occurred processing the "${eventType}" event from the Telegram application.\nPlease, file an issue here:\nhttps://github.com/Telegram-Mini-Apps/telegram-apps/issues/new/choose`,
          message,
          cause,
        );
      }
    }),
    // Clear emitters.
    () => subEmitter.clear(),
    () => mainEmitter.clear(),
  );

  return [{
    on: mainEmitter.on.bind(mainEmitter),
    off: mainEmitter.off.bind(mainEmitter),
    subscribe(listener) {
      return subEmitter.on('event', listener);
    },
    unsubscribe(listener) {
      subEmitter.off('event', listener);
    },
    get count() {
      return mainEmitter.count + subEmitter.count;
    },
  }, cleanup];
}
