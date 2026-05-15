import { Injectable, OnModuleInit } from '@nestjs/common';
import { OrganizationsService } from './modules/organizations/organizations.service';
import { LocationsService } from './modules/locations/locations.service';
import { TypesService } from './modules/types/types.service';
import { EventsService } from './modules/events/events.service';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private readonly orgsService: OrganizationsService,
    private readonly locationsService: LocationsService,
    private readonly typesService: TypesService,
    private readonly eventsService: EventsService,
  ) {}

  async onModuleInit() {
    const events = await this.eventsService.findAll();
    if (events.length > 0) return;

    console.log('Seeding initial data...');

    const orgs = await Promise.all([
      this.orgsService.create({ name: 'Acme Studio', contactEmail: 'hello@acme.com' }),
      this.orgsService.create({ name: 'Northwind Labs', contactEmail: 'team@northwind.io' }),
      this.orgsService.create({ name: 'Lumen Collective', contactEmail: 'info@lumen.co' }),
    ]);

    const locations = await Promise.all([
      this.locationsService.create({ name: 'HQ Auditorium', address: '1 Market St, SF', capacity: 200 }),
      this.locationsService.create({ name: 'Riverside Hall', address: '88 River Rd, NYC', capacity: 450 }),
      this.locationsService.create({ name: 'Online — Zoom', address: 'Virtual', capacity: 1000 }),
    ]);

    const types = await Promise.all([
      this.typesService.create({ label: 'Workshop', colorHex: '#8b5cf6' }),
      this.typesService.create({ label: 'Webinar', colorHex: '#ec4899' }),
      this.typesService.create({ label: 'Networking', colorHex: '#06b6d4' }),
      this.typesService.create({ label: 'Conference', colorHex: '#f59e0b' }),
    ]);

    const now = new Date();
    const day = 86400000;

    await this.eventsService.create({
      name: 'Quarterly Product Strategy',
      timestamp: new Date(now.getTime() - day * 5).toISOString(),
      details: 'Cross-team alignment on the roadmap, OKRs, and launches for the upcoming quarter.',
      typeId: types[3].id,
      organizationId: orgs[0].id,
      collaboratorIds: [orgs[1].id],
      locationId: locations[0].id,
    });

    await this.eventsService.create({
      name: 'Design Systems Workshop',
      timestamp: new Date(now.getTime() + day * 2).toISOString(),
      details: 'Hands-on session on tokens, theming, and component composition.',
      typeId: types[0].id,
      organizationId: orgs[2].id,
      collaboratorIds: [orgs[0].id, orgs[1].id],
      locationId: locations[2].id,
    });

    console.log('Seeding complete!');
  }
}
