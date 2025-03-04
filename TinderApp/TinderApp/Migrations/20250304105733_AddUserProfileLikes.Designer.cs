﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TinderApp.Data;

#nullable disable

namespace TinderApp.Migrations
{
    [DbContext(typeof(TinderDbContext))]
    [Migration("20250304105733_AddUserProfileLikes")]
    partial class AddUserProfileLikes
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.11")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Data.Entities.Interest", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("Interests");
                });

            modelBuilder.Entity("InterestUserProfile", b =>
                {
                    b.Property<int>("InterestsId")
                        .HasColumnType("int");

                    b.Property<int>("UserProfilesId")
                        .HasColumnType("int");

                    b.HasKey("InterestsId", "UserProfilesId");

                    b.HasIndex("UserProfilesId");

                    b.ToTable("InterestUserProfile");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<int>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("RoleId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<int>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<int>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<int>", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.Property<int>("RoleId")
                        .HasColumnType("int");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasMaxLength(21)
                        .HasColumnType("nvarchar(21)");

                    b.HasKey("UserId", "RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);

                    b.HasDiscriminator().HasValue("IdentityUserRole<int>");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<int>", b =>
                {
                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("TinderApp.Data.Entities.Gender", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("Genders");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Name = "Male"
                        },
                        new
                        {
                            Id = 2,
                            Name = "Female"
                        },
                        new
                        {
                            Id = 3,
                            Name = "Other"
                        });
                });

            modelBuilder.Entity("TinderApp.Data.Entities.Identity.RoleEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles", (string)null);

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Name = "User",
                            NormalizedName = "USER"
                        },
                        new
                        {
                            Id = 2,
                            Name = "Admin",
                            NormalizedName = "ADMIN"
                        });
                });

            modelBuilder.Entity("TinderApp.Data.Entities.Identity.UserEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("bit");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("TinderApp.Data.Entities.InterestedIn", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("InterestedInOptions");
                });

            modelBuilder.Entity("TinderApp.Data.Entities.LookingFor", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("LookingForOptions");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Name = "Long-Term Relationship"
                        },
                        new
                        {
                            Id = 2,
                            Name = "Short-term romance"
                        },
                        new
                        {
                            Id = 3,
                            Name = "Serious relationship"
                        },
                        new
                        {
                            Id = 4,
                            Name = "New friends"
                        },
                        new
                        {
                            Id = 5,
                            Name = "Non-serious relationship"
                        },
                        new
                        {
                            Id = 6,
                            Name = "I'm not sure yet"
                        });
                });

            modelBuilder.Entity("TinderApp.Data.Entities.ProfilePhoto", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<bool>("IsPrimary")
                        .HasColumnType("bit");

                    b.Property<string>("Path")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ProfileId")
                        .HasColumnType("int");

                    b.Property<int?>("UserProfileId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ProfileId");

                    b.HasIndex("UserProfileId");

                    b.ToTable("ProfilePhotos");
                });

            modelBuilder.Entity("TinderApp.Data.Entities.SexualOrientation", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("SexualOrientations");
                });

            modelBuilder.Entity("TinderApp.Data.Entities.UserProfile", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateOnly?>("BirthDay")
                        .IsRequired()
                        .HasColumnType("date");

                    b.Property<int>("GenderId")
                        .HasColumnType("int");

                    b.Property<int>("InterestedInId")
                        .HasColumnType("int");

                    b.Property<bool>("IsReported")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasDefaultValue(false);

                    b.Property<int>("LookingForId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<int>("SexualOrientationId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("GenderId");

                    b.HasIndex("InterestedInId");

                    b.HasIndex("LookingForId");

                    b.HasIndex("SexualOrientationId");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("Profiles");
                });

            modelBuilder.Entity("UserProfileLikes", b =>
                {
                    b.Property<int>("UserProfileId")
                        .HasColumnType("int");

                    b.Property<int>("LikedByUserId")
                        .HasColumnType("int");

                    b.HasKey("UserProfileId", "LikedByUserId");

                    b.HasIndex("LikedByUserId");

                    b.ToTable("UserProfileLikes", (string)null);
                });

            modelBuilder.Entity("UserProfileMatches", b =>
                {
                    b.Property<int>("UserProfileId")
                        .HasColumnType("int");

                    b.Property<int>("MatchedUserId")
                        .HasColumnType("int");

                    b.HasKey("UserProfileId", "MatchedUserId");

                    b.HasIndex("MatchedUserId");

                    b.ToTable("UserProfileMatches", (string)null);
                });

            modelBuilder.Entity("UserRoleEntity", b =>
                {
                    b.HasBaseType("Microsoft.AspNetCore.Identity.IdentityUserRole<int>");

                    b.HasIndex("RoleId");

                    b.HasDiscriminator().HasValue("UserRoleEntity");
                });

            modelBuilder.Entity("InterestUserProfile", b =>
                {
                    b.HasOne("Data.Entities.Interest", null)
                        .WithMany()
                        .HasForeignKey("InterestsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TinderApp.Data.Entities.UserProfile", null)
                        .WithMany()
                        .HasForeignKey("UserProfilesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<int>", b =>
                {
                    b.HasOne("TinderApp.Data.Entities.Identity.RoleEntity", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<int>", b =>
                {
                    b.HasOne("TinderApp.Data.Entities.Identity.UserEntity", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<int>", b =>
                {
                    b.HasOne("TinderApp.Data.Entities.Identity.UserEntity", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<int>", b =>
                {
                    b.HasOne("TinderApp.Data.Entities.Identity.UserEntity", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("TinderApp.Data.Entities.ProfilePhoto", b =>
                {
                    b.HasOne("TinderApp.Data.Entities.UserProfile", "Profile")
                        .WithMany()
                        .HasForeignKey("ProfileId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TinderApp.Data.Entities.UserProfile", null)
                        .WithMany("ProfilePhotos")
                        .HasForeignKey("UserProfileId");

                    b.Navigation("Profile");
                });

            modelBuilder.Entity("TinderApp.Data.Entities.UserProfile", b =>
                {
                    b.HasOne("TinderApp.Data.Entities.Gender", "Gender")
                        .WithMany()
                        .HasForeignKey("GenderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TinderApp.Data.Entities.InterestedIn", "InterestedIn")
                        .WithMany()
                        .HasForeignKey("InterestedInId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TinderApp.Data.Entities.LookingFor", "LookingFor")
                        .WithMany()
                        .HasForeignKey("LookingForId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TinderApp.Data.Entities.SexualOrientation", "SexualOrientation")
                        .WithMany()
                        .HasForeignKey("SexualOrientationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TinderApp.Data.Entities.Identity.UserEntity", "User")
                        .WithOne("Profile")
                        .HasForeignKey("TinderApp.Data.Entities.UserProfile", "UserId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("Gender");

                    b.Navigation("InterestedIn");

                    b.Navigation("LookingFor");

                    b.Navigation("SexualOrientation");

                    b.Navigation("User");
                });

            modelBuilder.Entity("UserProfileLikes", b =>
                {
                    b.HasOne("TinderApp.Data.Entities.UserProfile", null)
                        .WithMany()
                        .HasForeignKey("LikedByUserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("TinderApp.Data.Entities.UserProfile", null)
                        .WithMany()
                        .HasForeignKey("UserProfileId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                });

            modelBuilder.Entity("UserProfileMatches", b =>
                {
                    b.HasOne("TinderApp.Data.Entities.UserProfile", null)
                        .WithMany()
                        .HasForeignKey("MatchedUserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("TinderApp.Data.Entities.UserProfile", null)
                        .WithMany()
                        .HasForeignKey("UserProfileId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
                });

            modelBuilder.Entity("UserRoleEntity", b =>
                {
                    b.HasOne("TinderApp.Data.Entities.Identity.RoleEntity", "Role")
                        .WithMany("UserRoles")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TinderApp.Data.Entities.Identity.UserEntity", "User")
                        .WithMany("UserRoles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Role");

                    b.Navigation("User");
                });

            modelBuilder.Entity("TinderApp.Data.Entities.Identity.RoleEntity", b =>
                {
                    b.Navigation("UserRoles");
                });

            modelBuilder.Entity("TinderApp.Data.Entities.Identity.UserEntity", b =>
                {
                    b.Navigation("Profile");

                    b.Navigation("UserRoles");
                });

            modelBuilder.Entity("TinderApp.Data.Entities.UserProfile", b =>
                {
                    b.Navigation("ProfilePhotos");
                });
#pragma warning restore 612, 618
        }
    }
}
