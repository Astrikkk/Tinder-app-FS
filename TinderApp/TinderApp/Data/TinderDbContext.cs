﻿using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TinderApp.Data.Entities;

namespace TinderApp.Data
{
    public class TinderDbContext : DbContext //IdentityDbContext<User>
    {
        public TinderDbContext(DbContextOptions<TinderDbContext> options) : base(options)
        {
        }

        public DbSet<Profile> Profiles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //modelBuilder.Entity<User>()
            //    .HasOne(u => u.Profile)
            //    .WithOne(p => p.User)
            //    .HasForeignKey<Profile>(p => p.UserId);
        }
    }
}
