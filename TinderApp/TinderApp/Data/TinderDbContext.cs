using Data.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TinderApp.Data.Entities;
using TinderApp.Data.Entities.Identity;

namespace TinderApp.Data
{
    public class TinderDbContext : IdentityDbContext<User, RoleEntity, int>
    {
        public TinderDbContext(DbContextOptions<TinderDbContext> options) : base(options) { }

        public DbSet<UserProfile> Profiles { get; set; }
        public DbSet<ProfilePhoto> ProfilePhotos { get; set; }
        public DbSet<Gender> Genders { get; set; }
        public DbSet<InterestedIn> InterestedInOptions { get; set; }
        public DbSet<LookingFor> LookingForOptions { get; set; }
        public DbSet<SexualOrientation> SexualOrientations { get; set; }
        public DbSet<Interest> Interests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure RoleEntity Id as auto-generated
            modelBuilder.Entity<RoleEntity>()
                .Property(r => r.Id)
                .ValueGeneratedOnAdd();

            // Configure UserRoleEntity relationships
            modelBuilder.Entity<UserRoleEntity>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId);

            modelBuilder.Entity<UserRoleEntity>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);

            // Seed initial data for Gender
            modelBuilder.Entity<Gender>().HasData(
                new Gender { Id = 1, Name = "Male" },
                new Gender { Id = 2, Name = "Female" },
                new Gender { Id = 3, Name = "Other" }
            );

            // Seed initial data for Roles
            modelBuilder.Entity<RoleEntity>().HasData(
                new RoleEntity { Id = 1, Name = "User", NormalizedName = "USER" },
                new RoleEntity { Id = 2, Name = "Admin", NormalizedName = "ADMIN" }
            );

            // Configure User and Profile one-to-one relationship
            modelBuilder.Entity<User>()
                .HasOne(u => u.Profile)
                .WithOne(p => p.User)
                .HasForeignKey<UserProfile>(p => p.UserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure ProfilePhoto and Profile relationship
            modelBuilder.Entity<ProfilePhoto>()
                .HasOne(p => p.Profile)
                .WithMany()
                .HasForeignKey(p => p.ProfileId)
                .OnDelete(DeleteBehavior.Cascade);

            // Add unique constraints for various entities
            modelBuilder.Entity<Gender>().HasIndex(g => g.Name).IsUnique();
            modelBuilder.Entity<InterestedIn>().HasIndex(i => i.Name).IsUnique();
            modelBuilder.Entity<LookingFor>().HasIndex(l => l.Name).IsUnique();
            modelBuilder.Entity<SexualOrientation>().HasIndex(s => s.Name).IsUnique();
            modelBuilder.Entity<Interest>().HasIndex(i => i.Name).IsUnique();
        }
    }
}
