import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BudgetsService } from './budgets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Budgets')
@Controller('budgets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BudgetsController {
  constructor(private readonly service: BudgetsService) {}

  @Get('organization/:orgId')
  @ApiOperation({ summary: 'List budgets by organization' })
  findAll(@Param('orgId') orgId: string) {
    return this.service.findAll(orgId);
  }

  @Get('analysis/:orgId')
  @ApiOperation({ summary: 'Get budget vs actual spending' })
  getAnalysis(@Param('orgId') orgId: string) {
    return this.service.getBudgetVsActual(orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get budget by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new budget' })
  create(@Body() data: {
    organizationId: string; categoryId?: string; name: string;
    amount: number; period: string; startDate: string; endDate: string;
  }) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update budget' })
  update(@Param('id') id: string, @Body() data: {
    categoryId?: string; name?: string; amount?: number;
    period?: string; startDate?: string; endDate?: string;
  }) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate budget' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
