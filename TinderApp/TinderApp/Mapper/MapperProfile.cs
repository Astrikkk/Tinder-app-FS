using AutoMapper;
using TinderApp.DTOs;
using TinderApp.Data.Entities;

namespace TinderApp.Mapper
{
    public class MappingProfile : Profile  // Inherit from AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<UserProfile, ProfileItemDTO>()
                .ForMember(dto => dto.ImagePath, opt => opt.MapFrom(profile =>
                    profile.ProfilePhotos != null && profile.ProfilePhotos.Any(photo => photo.IsPrimary)
                        ? $"/images/profiles/{profile.ProfilePhotos.First(photo => photo.IsPrimary).Path}"
                        : "/images/profiles/noimage.jpg"))
                .ForMember(dto => dto.Gender, opt => opt.MapFrom(profile => profile.Gender))
                .ForMember(dest => dest.JobPosition, opt => opt.MapFrom(src =>
        src.JobPosition != null
            ? new JobPositionDTO { Id = src.JobPosition.Id, Name = src.JobPosition.Name }
            : null))
                .ForMember(dto => dto.LookingFor, opt => opt.MapFrom(profile => profile.LookingFor))
                .ForMember(dto => dto.InterestedIn, opt => opt.MapFrom(profile => profile.InterestedIn))
               .ForMember(dto => dto.Interests, opt => opt.MapFrom(profile => profile.Interests
                .Select(i => new InterestForProfileDTO { Id = i.Id, Name = i.Name }).ToList()))
               .ForMember(dto => dto.SexualOrientation, opt => opt.MapFrom(profile => profile.SexualOrientation))
                .ForMember(dto => dto.Photos, opt => opt.MapFrom(profile => profile.ProfilePhotos.Select(photo => $"/images/profiles/{photo.Path}").ToList()))
                .ForMember(dto => dto.LikedByUserIds, opt => opt.MapFrom(profile => profile.LikedBy != null ? profile.LikedBy.Select(u => u.UserId).ToList() : new List<int>()))
                .ForMember(dto => dto.LikedUsersIds, opt => opt.MapFrom(profile => profile.LikedUsers != null ? profile.LikedUsers.Select(u => u.UserId).ToList() : new List<int>()))
                .ForMember(dto => dto.SuperLikedByUserIds, opt => opt.MapFrom(profile => profile.SuperLikedBy != null ? profile.SuperLikedBy.Select(u => u.UserId).ToList() : new List<int>()))
                .ForMember(dto => dto.MatchedUserIds, opt => opt.MapFrom(profile => profile.Matches != null ? profile.Matches.Select(u => u.UserId).ToList() : new List<int>()))
                .ForMember(dto => dto.BlockedUsersID, opt => opt.MapFrom(profile => profile.BlockedUsers != null ? profile.BlockedUsers.Select(u => u.UserId).ToList() : new List<int>()))
                .ForMember(dto => dto.CreatedChats, opt => opt.MapFrom(profile => profile.User != null ? profile.User.CreatedChats.Select(chat => chat.ChatRoom).ToList() : new List<Guid>()))
                .ForMember(dto => dto.ParticipatedChats, opt => opt.MapFrom(profile => profile.User != null ? profile.User.ParticipatedChats.Select(chat => chat.ChatRoom).ToList() : new List<Guid>()))
                .ForMember(dto => dto.Location, opt => opt.MapFrom(profile => profile.Location))
                .ForMember(dto => dto.isOnline, opt => opt.MapFrom(profile => profile.User.IsOnline));



            CreateMap<ProfileCreateRequest, UserProfile>()
                .ForMember(entity => entity.ProfilePhotos, opt => opt.Ignore())
                .ForMember(entity => entity.Interests, opt => opt.Ignore());

            CreateMap<ProfileUpdateRequest, UserProfile>()
      // Інші поля будуть мапитись автоматично, якщо імена співпадають
      .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));



            CreateMap<UserProfile, ProfileResponse>()
                .ForMember(dto => dto.Gender, opt => opt.MapFrom(profile => profile.Gender.Name))
                .ForMember(dto => dto.SexualOrientation, opt => opt.MapFrom(profile => profile.SexualOrientation.Name))
                .ForMember(dto => dto.Photos, opt => opt.MapFrom(profile => profile.ProfilePhotos.Select(photo => $"/images/{photo.Path}").ToList()))
                .ForMember(dto => dto.Interests, opt => opt.MapFrom(profile => profile.Interests.Select(interest => interest.Name).ToList()));

            CreateMap<UserProfile, ProfileDetailsDTO>()
                .ForMember(dest => dest.GenderName, opt => opt.MapFrom(src => src.Gender.Name))
                .ForMember(dest => dest.JobPositionName, opt => opt.MapFrom(src => src.JobPosition.Name))
                .ForMember(dest => dest.ProfilePhotoPaths, opt => opt.MapFrom(src => src.ProfilePhotos.Select(p => $"/images/{p.Path}")));
        }
    }
}