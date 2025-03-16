﻿using System.ComponentModel.DataAnnotations;

namespace TinderApp.Data.Entities.ProfileProp
{
    public class Country
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
    }
}
