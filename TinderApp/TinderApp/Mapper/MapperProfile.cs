using AutoMapper;
using TinderApp.DTOs;
using TinderApp.Data.Entities;

namespace TinderApp.Mapper
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            // Map from ProfileCreateRequest DTO to Profile entity
            CreateMap<Data.Entities.Profile, ProfileItemDTO>()
                .ForMember(x => x.ImagePath, opt => opt.MapFrom(x =>
                        string.IsNullOrEmpty(x.Image) ? "/images/noimage.jpg" : $"/images/300_{x.Image}"));

            CreateMap<ProfileCreateRequest, Data.Entities.Profile>()
                .ForMember(x => x.Image, opt => opt.Ignore());
        }
    }
}