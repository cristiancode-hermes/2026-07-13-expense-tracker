import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReceiptsService } from './receipts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Receipts')
@Controller('receipts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReceiptsController {
  constructor(private readonly service: ReceiptsService) {}

  @Get('expense/:expenseId')
  @ApiOperation({ summary: 'List receipts for an expense' })
  findByExpense(@Param('expenseId') expenseId: string) {
    return this.service.findByExpense(expenseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get receipt by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Upload a receipt' })
  create(@Body() data: { expenseId: string; fileName: string; filePath: string; mimeType: string; fileSize: number }) {
    return this.service.create(data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a receipt' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
