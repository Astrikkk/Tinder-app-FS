using Data.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TinderApp.Data.Entities;

namespace TinderApp.Data
{
    public class TinderDbContext : IdentityDbContext<User>
    {
        public TinderDbContext(DbContextOptions<TinderDbContext> options) : base(options)
        {
        }

        public DbSet<Profile> Profiles { get; set; }
        public DbSet<ProfilePhoto> ProfilePhotos { get; set; }
        public DbSet<Gender> Genders { get; set; }
        public DbSet<InterestedIn> InterestedInOptions { get; set; }
        public DbSet<LookingFor> LookingForOptions { get; set; }
        public DbSet<SexualOrientation> SexualOrientations { get; set; }
        public DbSet<Interest> Interests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Gender>().HasData(
                new Gender { Id = 1, Name = "Male" },
                new Gender { Id = 2, Name = "Female" },
                new Gender { Id = 3, Name = "Other" }
            );

            modelBuilder.Entity<User>()
                 .HasOne(u => u.Profile)
                 .WithOne(p => p.User)
                 .HasForeignKey<Profile>(p => p.UserId)
                 .IsRequired(false) // Необов'язковий зв'язок
                 .OnDelete(DeleteBehavior.Cascade);


            // Configure ProfilePhoto and User relationship
            modelBuilder.Entity<ProfilePhoto>()
                .HasOne(p => p.Profile)
                .WithMany()
                .HasForeignKey(p => p.ProfileId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Gender, InterestedIn, LookingFor, and SexualOrientation unique constraints
            modelBuilder.Entity<Gender>()
                .HasIndex(g => g.Name)
                .IsUnique();

            modelBuilder.Entity<InterestedIn>()
                .HasIndex(i => i.Name)
                .IsUnique();

            modelBuilder.Entity<LookingFor>()
                .HasIndex(l => l.Name)
                .IsUnique();

            modelBuilder.Entity<SexualOrientation>()
                .HasIndex(s => s.Name)
                .IsUnique();

            modelBuilder.Entity<Interest>()
                .HasIndex(i => i.Name)
                .IsUnique();
        }
    }
}