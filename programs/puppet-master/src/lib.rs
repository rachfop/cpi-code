use anchor_lang::prelude::*;
use puppet::cpi::accounts::Increment;
use puppet::program::Puppet;
use puppet::{self, Counter};

declare_id!("9T9yTfQdcpEqbPLCrW9K7peHdFdzSrmwpSw3NuCdntV4");

#[program]
mod puppet_master {
    use super::*;
    pub fn control_puppet(ctx: Context<ControlPuppet>) -> Result<()> {
        puppet::cpi::increment(ctx.accounts.increment_ctx())
    }
}

#[derive(Accounts)]
pub struct ControlPuppet<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
    pub puppet_program: Program<'info, Puppet>,
}

impl<'info> ControlPuppet<'info> {
    pub fn increment_ctx(&self) -> CpiContext<'_, '_, '_, 'info, Increment<'info>> {
        let cpi_program = self.puppet_program.to_account_info();
        let cpi_accounts = Increment {
            counter: self.counter.to_account_info(),
        };
        CpiContext::new(cpi_program, cpi_accounts)
    }
}
