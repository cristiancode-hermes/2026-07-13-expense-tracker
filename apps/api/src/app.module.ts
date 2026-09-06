import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ExpensesModule } from './expenses/expenses.module';
import { BudgetsModule } from './budgets/budgets.module';
import { ReceiptsModule } from './receipts/receipts.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    OrganizationsModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    ExpensesModule,
    BudgetsModule,
    ReceiptsModule,
    SeedModule,
  ],
})
export class AppModule {}
