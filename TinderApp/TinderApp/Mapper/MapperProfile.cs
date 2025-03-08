using AutoMapper;
using TinderApp.DTOs;
using TinderApp.Data.Entities;

namespace TinderApp.Mapper
{
    public class MappingProfile : Profile  // Inherit from AutoMapper.Profile
    {
        public MappingProfile()
        {
            // Mapping for UserProfile to ProfileItemDTO
            CreateMap<UserProfile, ProfileItemDTO>()
                .ForMember(dto => dto.ImagePath, opt => opt.MapFrom(profile =>
                    profile.ProfilePhotos != null && profile.ProfilePhotos.Any(photo => photo.IsPrimary)
                        ? $"/images/profiles/{profile.ProfilePhotos.First(photo => photo.IsPrimary).Path}"
                        : "/images/profiles/noimage.jpg"))
                .ForMember(dto => dto.Gender, opt => opt.MapFrom(profile => profile.Gender))
                .ForMember(dto => dto.LookingFor, opt => opt.MapFrom(profile => profile.LookingFor))
                .ForMember(dto => dto.InterestedIn, opt => opt.MapFrom(profile => profile.InterestedIn))
                .ForMember(dto => dto.Interests, opt => opt.MapFrom(profile => profile.Interests))
                .ForMember(dto => dto.SexualOrientation, opt => opt.MapFrom(profile => profile.SexualOrientation))
                .ForMember(dto => dto.Photos, opt => opt.MapFrom(profile => profile.ProfilePhotos.Select(photo => $"/images/{photo.Path}").ToList()))
                .ForMember(dto => dto.LikedByUserIds, opt => opt.MapFrom(profile => profile.LikedBy.Select(u => u.Id).ToList())) // Map LikedBy
                .ForMember(dto => dto.MatchedUserIds, opt => opt.MapFrom(profile => profile.Matches.Select(u => u.Id).ToList())); // Map Matches

            // Mapping for ProfileCreateRequest to UserProfile
            CreateMap<ProfileCreateRequest, UserProfile>()
                .ForMember(entity => entity.ProfilePhotos, opt => opt.Ignore())
                .ForMember(entity => entity.Interests, opt => opt.Ignore());

            // Mapping for ProfileUpdateRequest to UserProfile
            CreateMap<ProfileUpdateRequest, UserProfile>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // Mapping for UserProfile to ProfileResponse
            CreateMap<UserProfile, ProfileResponse>()
                .ForMember(dto => dto.Gender, opt => opt.MapFrom(profile => profile.Gender.Name))
                .ForMember(dto => dto.SexualOrientation, opt => opt.MapFrom(profile => profile.SexualOrientation.Name))
                .ForMember(dto => dto.Photos, opt => opt.MapFrom(profile => profile.ProfilePhotos.Select(photo => $"/images/{photo.Path}").ToList()))
                .ForMember(dto => dto.Interests, opt => opt.MapFrom(profile => profile.Interests.Select(interest => interest.Name).ToList()));

            // Mapping for UserProfile to ProfileDetailsDTO
            CreateMap<UserProfile, ProfileDetailsDTO>()
                .ForMember(dest => dest.GenderName, opt => opt.MapFrom(src => src.Gender.Name))
                .ForMember(dest => dest.ProfilePhotoPaths, opt => opt.MapFrom(src => src.ProfilePhotos.Select(p => $"/images/{p.Path}")));
        }
    }
}