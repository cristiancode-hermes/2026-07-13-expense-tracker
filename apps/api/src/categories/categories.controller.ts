import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get('organization/:orgId')
  @ApiOperation({ summary: 'List categories by organization' })
  findAll(@Param('orgId') orgId: string) {
    return this.service.findAll(orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  create(@Body() data: { organizationId: string; name: string; icon?: string; color?: string }) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update category' })
  update(@Param('id') id: string, @Body() data: { name?: string; icon?: string; color?: string }) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate category' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
