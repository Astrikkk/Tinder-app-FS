using AutoMapper;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;
using TinderApp.Data.Entities;
using TinderApp.Data.Entities.Chat;
using TinderApp.Data.Entities.Identity;
using TinderApp.Data.Entities.ProfileProp;
using TinderApp.DTOs;

namespace TinderApp.Data
{
    public class TinderDbContext : IdentityDbContext<UserEntity, RoleEntity, int>
    {
        public TinderDbContext(DbContextOptions<TinderDbContext> options) : base(options) { }


        public DbSet<UserProfile> Profiles { get; set; }
        public DbSet<ProfilePhoto> ProfilePhotos { get; set; }
        public DbSet<Gender> Genders { get; set; }
        public DbSet<JobPosition> JobPosition { get; set; }
        public DbSet<InterestedIn> InterestedInOptions { get; set; }
        public DbSet<LookingFor> LookingForOptions { get; set; }
        public DbSet<SexualOrientation> SexualOrientations { get; set; }
        public DbSet<Interest> Interests { get; set; }
        public DbSet<ChatKey> ChatKeys { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<ChatConnection> ChatConnections { get; set; }

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

            modelBuilder.Entity<InterestedIn>().HasData(
                new Gender { Id = 1, Name = "Male" },
                new Gender { Id = 2, Name = "Female" },
                new Gender { Id = 3, Name = "bOTH" }
            );

            // Seed initial data for Roles
            modelBuilder.Entity<RoleEntity>().HasData(
                new RoleEntity { Id = 1, Name = "User", NormalizedName = "USER" },
                new RoleEntity { Id = 2, Name = "Admin", NormalizedName = "ADMIN" }
            );
            // Seed initial data for LookingFor
            modelBuilder.Entity<LookingFor>().HasData(
                new LookingFor { Id = 1, Name = "Long-Term Relationship" },
                new LookingFor { Id = 2, Name = "Short-term romance" },
                new LookingFor { Id = 3, Name = "Serious relationship" },
                new LookingFor { Id = 4, Name = "New friends" },
                new LookingFor { Id = 5, Name = "Non-serious relationship" },
                new LookingFor { Id = 6, Name = "I'm not sure yet" }
            );


            // Configure User and Profile one-to-one relationship
            modelBuilder.Entity<UserEntity>()
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

            modelBuilder.Entity<ChatConnection>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);


            // Add unique constraints for various entities
            modelBuilder.Entity<Gender>().HasIndex(g => g.Name).IsUnique();
            modelBuilder.Entity<InterestedIn>().HasIndex(i => i.Name).IsUnique();
            modelBuilder.Entity<LookingFor>().HasIndex(l => l.Name).IsUnique();
            modelBuilder.Entity<SexualOrientation>().HasIndex(s => s.Name).IsUnique();
            modelBuilder.Entity<Interest>().HasIndex(i => i.Name).IsUnique();

            modelBuilder.Entity<UserProfile>()
                .Property(p => p.IsReported)
                .HasDefaultValue(false);

            modelBuilder.Entity<UserProfile>()
                .HasMany(p => p.Matches)
                .WithMany()
                .UsingEntity<Dictionary<string, object>>(
                    "UserProfileMatches",
                    j => j
                        .HasOne<UserProfile>()
                        .WithMany()
                        .HasForeignKey("MatchedUserId")
                        .OnDelete(DeleteBehavior.Restrict),
                    j => j
                        .HasOne<UserProfile>()
                        .WithMany()
                        .HasForeignKey("UserProfileId")
                        .OnDelete(DeleteBehavior.Restrict),
                    j =>
                    {
                        j.HasKey("UserProfileId", "MatchedUserId");
                        j.ToTable("UserProfileMatches");
                    });



            modelBuilder.Entity<UserProfile>()
                .HasMany(p => p.LikedBy)
                .WithMany()
                .UsingEntity<Dictionary<string, object>>(
                    "UserProfileLikes",
                    j => j
                        .HasOne<UserProfile>()
                        .WithMany()
                        .HasForeignKey("LikedByUserId")
                        .OnDelete(DeleteBehavior.Restrict),
                    j => j
                        .HasOne<UserProfile>()
                        .WithMany()
                        .HasForeignKey("UserProfileId")
                        .OnDelete(DeleteBehavior.Restrict),
                    j =>
                    {
                        j.HasKey("UserProfileId", "LikedByUserId");
                        j.ToTable("UserProfileLikes");
                    });

            modelBuilder.Entity<UserProfile>()
                .HasMany(p => p.LikedUsers)
                .WithMany()
                .UsingEntity<Dictionary<string, object>>(
                    "UserProfileLiked",
                    j => j
                        .HasOne<UserProfile>()
                        .WithMany()
                        .HasForeignKey("LikedUsersUserId")
                        .OnDelete(DeleteBehavior.Restrict),
                    j => j
                        .HasOne<UserProfile>()
                        .WithMany()
                        .HasForeignKey("UserProfileId")
                        .OnDelete(DeleteBehavior.Restrict),
                    j =>
                    {
                        j.HasKey("UserProfileId", "LikedUsersUserId");
                        j.ToTable("UserProfileLiked");
                    });


            modelBuilder.Entity<UserProfile>()
                .HasMany(p => p.SuperLikedBy)
                .WithMany()
                .UsingEntity<Dictionary<string, object>>(
                    "UserProfileSuperLikes",
                    j => j
                        .HasOne<UserProfile>()
                        .WithMany()
                        .HasForeignKey("SuperLikedByUserId")
                        .OnDelete(DeleteBehavior.Restrict),
                    j => j
                        .HasOne<UserProfile>()
                        .WithMany()
                        .HasForeignKey("UserProfileId")
                        .OnDelete(DeleteBehavior.Restrict),
                    j =>
                    {
                        j.HasKey("UserProfileId", "SuperLikedByUserId");
                        j.ToTable("UserProfileSuperLikes");
                    });


            modelBuilder.Entity<UserProfile>()
                .HasMany(p => p.BlockedUsers)
                .WithMany()
                .UsingEntity<Dictionary<string, object>>(
                    "UserProfileBlocks",
                    j => j
                        .HasOne<UserProfile>()
                        .WithMany()
                        .HasForeignKey("BlockedUserId")
                        .OnDelete(DeleteBehavior.Restrict),
                    j => j
                        .HasOne<UserProfile>()
                        .WithMany()
                        .HasForeignKey("UserProfileId")
                        .OnDelete(DeleteBehavior.Restrict),
                    j =>
                    {
                        j.HasKey("UserProfileId", "BlockedUserId");
                        j.ToTable("UserProfileBlocks");
                    });



            modelBuilder.Entity<UserEntity>()
                .HasMany(u => u.CreatedChats)
                .WithOne(c => c.Creator)
                .HasForeignKey(c => c.CreatorId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserEntity>()
                .HasMany(u => u.ParticipatedChats)
                .WithOne(c => c.Participant)
                .HasForeignKey(c => c.ParticipantId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<ChatKey>()
                .HasIndex(c => new { c.CreatorId, c.ParticipantId })
                .IsUnique();

            modelBuilder.Entity<UserProfile>()
                    .HasOne(p => p.JobPosition)
                    .WithMany(j => j.UserProfiles)
                    .HasForeignKey(p => p.JobPositionId);



        }
    }
}