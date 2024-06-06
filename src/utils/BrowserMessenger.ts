export type MessageData = {
  type: string;
  data: any;
};

export enum WEB_EVENT {
  SET_TITLE = 'web:set-title',
  SHOW_NAVBAR = 'web:show-navbar',
  HIDE_NAVBAR = 'web:hide-navbar',
  OPEN_LINK = 'web:open-link',
  CLOSE_WINDOW = 'web:close-window',
  OPEN_CAMERA = 'web:open-camera',
  OPEN_ALBUM = 'web:open-album',
  OPEN_DOCUMENT = 'web:open-document',
  REQUEST_LOCATION = 'web:request-location',
  REQUEST_CURRENT_USER = 'web:request-current-user',
  REQUEST_APP_CONFIG = 'web:request-app-config',
  REQUEST_SCAN = 'web:request-scan',
  DOWNLOAD = 'web:download',
  SAVE_TO_ALBUM = 'web:save-to-album',
  PREVIEW_PDF = 'web:preview-pdf',
  DIAL = 'web:dial',
  EMAIL = 'web:email',
  TOKEN_EXPIRED = 'web:token-expired',
}

export enum NATIVE_EVENT {
  LOCATION = 'native:location',
  LOGGED_IN = 'native:logged-in',
  UPLOAD_DATA_READY = 'native:upload-data-ready',
  GET_CURRENT_USER = 'native:get-current-user',
  GET_APP_CONFIG = 'native:get-app-config',
  GET_SCAN_RESULT = 'native:get-scan-result',
  DOWNLOAD_COMPLETED = 'native:download-completed',
  HISTORY_BACK = 'native:history-back',
  SAVED_TO_ALBUM = 'native:saved-to-album',
}

// export enum EVENT_TYPE {
//   LOGIN = "login",
//   QRCODE_SCAN = "qrcode",
//   LOCATION = "location",
//   QUIT = "quit",
//   NAVIGATION = "navigation",
//   NAVIGATION_CHANGE = "navigation_change",
//   MAP = "map",
//   PHONE = "phone",
//   PICTURE_LOADING = "picture_loading",
//   TITLE = "title",
// }

type CallbackFunction = (event: { type: NATIVE_EVENT; data: any }) => void;

export class BrowserMessenger {
  static instance: BrowserMessenger;
  events: Map<string, Set<CallbackFunction>> = new Map();
  constructor() {
    if (!BrowserMessenger.instance) {
      window.addEventListener('message', this.onMessage.bind(this));
      document.addEventListener('message', this.onMessage.bind(this));
      BrowserMessenger.instance = this;
    }
    return BrowserMessenger.instance;
  }

  onMessage(event: any) {
    if (!event || event.origin.match(/^chrome-extension/)) {
      return;
    }
    if (typeof event.data === 'object') {
      if (event.data?.source?.match(/^react-devtools/)) {
        return;
      }
    }
    try {
      const { data, type } = JSON.parse(event.data);
      if (!type.match(/^native:/)) {
        return;
      }
      // if (data?.request) return;
      const callbacks = this.events?.get(type);
      if (callbacks && callbacks.size) {
        callbacks.forEach((f: CallbackFunction) => f(data));
      }
    } catch (e: any) {
      console.warn('onBrowserMessenger: ', e.message, ' data received:', event);
    }
  }

  clearEvent(type: string) {
    if (type) {
      this.events?.get(type)?.clear();
    } else {
      Array.from(Object.values(this.events || '[]')).forEach(callbacks => {
        callbacks.clear();
      });
    }
  }

  removeEvent(type: string, callback?: CallbackFunction) {
    const callbacks: Set<CallbackFunction> | undefined = this.events?.get(type);

    if (!callbacks) return;
    if (!callback) {
      callbacks.clear();
    } else {
      callbacks.delete(callback);
    }
  }

  addEvent(
    type: string,
    callback: CallbackFunction,
    options?: {
      mode?: 'replace' | 'append';
      removeAfterDuration?: number;
    },
  ) {
    if (!this.events.get(type) || options?.mode === 'replace') {
      this.events.set(type, new Set());
    }
    const callbacks: any = this.events.get(type);
    callbacks.add(callback);
    const remove = () => {
      callbacks.delete(callback);
    };
    if (options?.removeAfterDuration) {
      setTimeout(() => {
        remove();
      }, options.removeAfterDuration);
    }
    // this.postMessage(JSON.stringify({ type, data: { request: true } }));
    return remove;
  }
  postMessage(msgBody: any) {
    if (typeof msgBody !== 'string') {
      msgBody = JSON.stringify(msgBody);
    }
    this.getWebviewObj().postMessage(msgBody);
  }
  getWebviewObj() {
    const winObj: any = window;
    if (winObj.ReactNativeWebView) {
      return winObj.ReactNativeWebView;
    }
    return winObj;
  }
}

export const getInstance = () => {
  return new BrowserMessenger();
};

export default {
  getInstance,
};
