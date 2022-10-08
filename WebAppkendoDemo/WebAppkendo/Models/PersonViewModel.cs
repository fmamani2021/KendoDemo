using System.Collections.Generic;

namespace WebAppkendo.Models
{
    public class PersonViewModel
    {
        public Person Person { get; set; }
        public List<Rol> Roles { get; set; } = new List<Rol>();
    }
}