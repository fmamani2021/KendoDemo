using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAppkendo.Models
{
    public class Person
    {
        public Person() { }
        public Person(string UUId, string name, string lastName, int? rolId, int? countryId, bool? active, DateTime? expireDate, DateTime? createdDate)
        {
            this.UUId = UUId;
            Name = name;
            LastName = lastName;
            RolId = rolId;
            CountryId = countryId;
            Active = active;
            ExpireDate = expireDate;
            CreatedDate = createdDate;
        }

        public void Update(Person person)
        {
            Name = person.Name;
            LastName = person.LastName;
            RolId = person.RolId;
            CountryId = person.CountryId;
            ExpireDate = person.ExpireDate;
            Active = person.Active;
        }

        public string UUId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public int? RolId { get; set; }
        public int? CountryId { get; set; }
        public string CountryDescription { get; set; }
        public bool? Active { get; set; } = true;
        public DateTime? ExpireDate { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}