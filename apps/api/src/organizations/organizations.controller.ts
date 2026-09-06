import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';

@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly service: OrganizationsService) {}

  @Get()
  @ApiOperation({ summary: 'List all active organizations' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  create(@Body() data: { name: string }) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an organization' })
  update(@Param('id') id: string, @Body() data: { name?: string }) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate an organization' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
