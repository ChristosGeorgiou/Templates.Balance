import { Component, ElementRef, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ConfigService, Profile } from '@balnc/common'

@Component({
  selector: 'core-settings-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent {

  @ViewChild('name') name: ElementRef
  @ViewChild('alias') alias: ElementRef

  profileName: string
  profileAlias: string

  selected: string
  profile: Profile

  deleteData = false
  deleteDataRemote = false
  needReload = false

  constructor (
    private router: Router,
    private route: ActivatedRoute,
    private configService: ConfigService
  ) { }

  setup (alias: string) {
    this.needReload = false
    let _profile = this.configService.getProfile(alias)
    if (!_profile) {
      this.router.navigate(['/settings'])
    }
    this.profileName = _profile.name
    this.profileAlias = _profile.id
    this.profile = _profile
  }

  save () {
    this.configService.saveBModule(this.profile)
    this.needReload = true
  }

  reload () {
    window.location.reload()
  }

  delete () {
    this.configService.deleteProfile(this.profile.id)
    this.router.navigate(['/settings'])
  }

  activate () {
    this.configService.selectProfile(this.profile.id)
  }
}
