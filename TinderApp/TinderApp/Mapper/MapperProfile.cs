using AutoMapper;
using TinderApp.DTOs;
using TinderApp.Data.Entities;

namespace TinderApp.Mapper
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            // Map Profile entity to ProfileItemDTO
            CreateMap<Data.Entities.Profile, ProfileItemDTO>()
                .ForMember(dto => dto.ImagePath, opt => opt.MapFrom(profile =>
                    profile.ProfilePhotos != null && profile.ProfilePhotos.Any(photo => photo.IsPrimary)
                        ? $"/images/{profile.ProfilePhotos.First(photo => photo.IsPrimary).Path}" // Додаємо "/images/" перед шляхом
                        : "/images/noimage.jpg"))
                .ForMember(dto => dto.Gender, opt => opt.MapFrom(profile => profile.Gender.Name))
                .ForMember(dto => dto.LookingFor, opt => opt.MapFrom(profile => profile.LookingFor.Name));

            // Map ProfileCreateRequest DTO to Profile entity
            CreateMap<ProfileCreateRequest, Data.Entities.Profile>()
                .ForMember(entity => entity.ProfilePhotos, opt => opt.Ignore())
                .ForMember(entity => entity.Interests, opt => opt.Ignore());

            // Map ProfileUpdateRequest DTO to Profile entity
            CreateMap<ProfileUpdateRequest, Data.Entities.Profile>()
                .ForMember(entity => entity.ProfilePhotos, opt => opt.Ignore())
                .ForMember(entity => entity.Interests, opt => opt.Ignore())
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // Map Profile entity to ProfileResponse DTO
            CreateMap<Data.Entities.Profile, ProfileResponse>()
                .ForMember(dto => dto.Gender, opt => opt.MapFrom(profile => profile.Gender.Name))
                .ForMember(dto => dto.InterestedIn, opt => opt.MapFrom(profile => profile.InterestedIn.Name))
                .ForMember(dto => dto.LookingFor, opt => opt.MapFrom(profile => profile.LookingFor.Name))
                .ForMember(dto => dto.SexualOrientation, opt => opt.MapFrom(profile => profile.SexualOrientation.Name))
                .ForMember(dto => dto.Photos, opt => opt.MapFrom(profile => profile.ProfilePhotos.Select(photo => $"/images/{photo.Path}").ToList())) // Додаємо "/images/" до шляху фото
                .ForMember(dto => dto.Interests, opt => opt.MapFrom(profile => profile.Interests.Select(interest => interest.Name).ToList()));

            CreateMap<Data.Entities.Profile, ProfileDetailsDTO>()
                .ForMember(dest => dest.GenderName, opt => opt.MapFrom(src => src.Gender.Name))
                .ForMember(dest => dest.InterestedInName, opt => opt.MapFrom(src => src.InterestedIn.Name))
                .ForMember(dest => dest.LookingForName, opt => opt.MapFrom(src => src.LookingFor.Name))
                .ForMember(dest => dest.SexualOrientationName, opt => opt.MapFrom(src => src.SexualOrientation.Name))
                .ForMember(dest => dest.Interests, opt => opt.MapFrom(src => src.Interests.Select(i => i.Name)))
                .ForMember(dest => dest.ProfilePhotoPaths, opt => opt.MapFrom(src => src.ProfilePhotos.Select(p => $"/images/{p.Path}"))); // Додаємо "/images/" до шляху фото
        }
    }

}
