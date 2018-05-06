/// <reference types="zone.js" />
import { Observable } from 'rxjs';
export declare const zoneOperator: <T>(zone?: Zone) => (source: Observable<T>) => Observable<{}>;
