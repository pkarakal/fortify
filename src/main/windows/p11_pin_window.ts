import * as wsServer from '@webcrypto-local/server';
import { BrowserWindow, IWindowOptions } from './window';
import { l10n } from '../../_main/l10n';

interface IP11PinWindowParams {
  params: {
    resolve: (pin: string) => void;
    reject: (error: Error) => void;
    pin: string,
    origin: string,
    label?: string;
  };
}

export class P11PinWindow extends BrowserWindow {
  constructor(options: Pick<IWindowOptions, 'onClosed'> & IP11PinWindowParams) {
    super({
      ...options,
      size: 'default',
      app: 'p11-pin',
      windowOptions: {
        alwaysOnTop: true,
      },
      title: options.params.label || l10n.get('p11-pin'),
    });
  }

  /**
   * Create the browser window.
   */
  static create(options: IP11PinWindowParams) {
    const window = new P11PinWindow({
      onClosed: () => {
        if (options.params.pin) {
          options.params.resolve(options.params.pin);
        } else {
          options.params.reject(new wsServer.WebCryptoLocalError(10001, 'Incorrect PIN value. It cannot be empty.'));
        }
      },
      ...options,
    });

    window.window.on('ready-to-show', () => {
      window.focus();
    });
  }
}
