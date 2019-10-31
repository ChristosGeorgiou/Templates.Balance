import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { RxDBService } from '@balnc/core'
import { Repository } from '@balnc/shared'
import * as _ from 'lodash'
import { BehaviorSubject } from 'rxjs'
import { ReportSettings } from './models/module-settings'
import { Report, RxReportDoc } from './models/report'

@Injectable()
export class ReportsService extends Repository<Report> {

  reportAdminRole = 'report-admin'
  settings: ReportSettings

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(
    dbService: RxDBService,
    private http: HttpClient
  ) {
    super(dbService)
    this.entity = 'report'
  }

  async all() {
    const data = await super.all()
    const reports = data
      .filter(report => {
        return report.data.roles
      })
      .filter(report => {
        // return report.roles.some(role => super.profileService.roles.indexOf(role) >= 0)
      })
      .sort((a, b) => {
        if (a.data.name < b.data.name) { return -1 }
        if (a.data.name > b.data.name) { return 1 }
        return 0
      })
    return reports
  }

  async one(id: string) {
    const reportDoc = await super.one(id)
    const report = _.cloneDeep(reportDoc) as Report

    report.data.filters.forEach(async filter => {
      switch (filter.type) {
        case 'select':
          filter.value = -1
          filter.items = filter.items ? filter.items : await this.getCommonData(filter.query)
          filter.items.unshift({ label: '-- Select --', value: -1 })
          break
        case 'date':
          if (filter.default === null) {
            filter.value = new Date() // moment().format('YYYY-MM-DD')
          } else {
            filter.value = new Date() // moment().add(filter.default.value, filter.default.type).format('YYYY-MM-DD')
          }
          break
      }
      return filter
    })
    return report
  }

  async getCommonData(query) {
    const result = await this.execute(query)
    return result['rows'].map(r => {
      return {
        value: r[0],
        label: r[1]
      }
    })
  }

  async generateQuery(report: Report, filters) {
    let query = ''
    try {
      const r = await super.one(report.data.alias)
      const attachment = (r as RxReportDoc).getAttachment('query.sql')
      query = await attachment.getStringData()
    } catch (err) {
      return Promise.reject(err)
    }

    return this.formatQuery(query, filters)
  }

  async execute(query) {
    const url = `${this.settings.host}/execute`
    const headers = this.generateHeaders()
    const result = await this.http.post(url, {
      query: query
    }, headers).toPromise()
    return result
  }

  async generatePdfMake(report: Report, data: any) {
    const fields = _.cloneDeep(report.data.fields)
    const pdf = _.cloneDeep(report.data.pdf)
    const d = _.cloneDeep(data)

    if (!pdf) {
      return Promise.reject('No pdf schema were found')
    }

    const indexes = []
    const header = []

    Object.keys(fields)
      .forEach((field) => {
        const i = d.columns.findIndex(column => {
          return column.name === field
        })
        if (i !== -1) {
          indexes.push(i)
          header.push(fields[field])
          // pdf.content[0].table.widths.push("100")
        }
      })

    pdf.content[0].table.body.push(header)

    d.rows.forEach(row => {
      const r = []
      indexes.forEach(j => {
        r.push(row[j])
      })
      pdf.content[0].table.body.push(r)
    })
    return pdf
  }

  idReportAdmin() {
    // return super.profileService.roles.indexOf(this.reportAdminRole) >= 0
  }

  private generateHeaders() {
    return {
      headers: {
        Authorization: 'Basic ' + btoa('key:' + this.settings.key)
      }
    }
  }

  formatQuery(query, filters) {
    for (const k in filters) {
      if (filters.hasOwnProperty(k)) {
        let value = ''
        switch (typeof filters[k]) {
          case 'string':
            value = `'${filters[k]}'`
            break
          case 'boolean':
            value = `${(filters[k] === true)}`
            break
          case 'number':
          case 'undefined':
            value = `${filters[k]}`
            break
        }
        query = query.replace(new RegExp(`{{${k}}}`, 'g'), value)
      }
    }
    return query
  }

}
