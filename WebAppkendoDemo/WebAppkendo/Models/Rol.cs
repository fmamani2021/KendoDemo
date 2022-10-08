using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebAppkendo.Models
{
    public class Rol
    {
        public Rol(int id, string code, string description)
        {
            Id = id;
            Code = code;
            Description = description;
        }

        public int Id { get; private set; }
        public string Code { get; private set; }
        public string Description { get; private set; }
    }
}