import { RxDocument } from 'rxdb'

export interface ContactConn {
  reference: string
  type: string
}

export enum ContactType {
  person = 'person',
  company = 'company'
}

export interface Contact {
  name: string
  type: ContactType
  tags: string[]
  details: {
    avatar?: string
    phones?: string[]
    emails?: string[]
    socials?: string[]
    offices?: {
      address: string
      location?: string
      phones?: string[]
      emails?: string[]
    }[]
    taxDetails?: {
      vatNumber: string
      taxOffice: string
      address: string
      legalName: string
      description: string
    }
  }
  conns?: ContactConn[]
}

export interface CEvent {
  contact: string
  date: number
  type: CEventType
  reference?: string
  comment?: string
}

export enum CEventType {
  ContactAccessed = 'ContactAccessed',
  ContactCreated = 'ContactCreated',
  ContactUpdated = 'ContactUpdated',
  ConnectionCreated = 'ConnectionCreated',
  ConnectionRemoved = 'ConnectionRemoved',
  OrderCreated = 'OrderCreated',
  OrderRemoved = 'OrderRemoved',
  InvoiceCreated = 'InvoiceCreated',
  InvoiceRemoved = 'InvoiceRemoved',
  AgreementCreated = 'AgreementCreated'
}

export type RxContactDoc = RxDocument<Contact> & Contact

export type RxCEventDoc = RxDocument<CEvent> & CEvent
