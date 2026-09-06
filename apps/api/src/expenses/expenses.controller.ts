import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Expenses')
@Controller('expenses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExpensesController {
  constructor(private readonly service: ExpensesService) {}

  @Get('organization/:orgId')
  @ApiOperation({ summary: 'List expenses with optional filters' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  findAll(
    @Param('orgId') orgId: string,
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.service.findAll(orgId, { categoryId, status, startDate, endDate });
  }

  @Get('dashboard/:orgId')
  @ApiOperation({ summary: 'Get dashboard stats for an organization' })
  getDashboard(@Param('orgId') orgId: string) {
    return this.service.getDashboardStats(orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get expense by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  create(@Body() data: {
    organizationId: string; userId: string; categoryId?: string;
    amount: number; description: string; date: string;
    isReimbursable?: boolean;
  }) {
    return this.service.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update expense' })
  update(@Param('id') id: string, @Body() data: {
    categoryId?: string; amount?: number; description?: string;
    date?: string; status?: string; isReimbursable?: boolean;
  }) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete expense' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
