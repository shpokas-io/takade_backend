import { Global, Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { SessionService } from './session.service';
import { AuthGuard } from './auth.guard';

@Global()
@Module({
  providers: [SupabaseService, SessionService, AuthGuard],
  exports: [SupabaseService, SessionService, AuthGuard],
})
export class CommonModule {} 