import { Injectable } from '@angular/core';
import { RxDBService } from '@balnc/core';
import { CommonService } from '@balnc/shared';
import { InvoicesEntities } from '../models/_entities';

@Injectable()
export class InvoicesService extends CommonService {

  constructor (
    dbService: RxDBService
  ) {
    super({
      alias: 'invoices',
      entities: InvoicesEntities,
      dbService: dbService
    })
  }
}
