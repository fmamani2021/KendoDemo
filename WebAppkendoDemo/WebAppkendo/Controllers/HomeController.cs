using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebAppkendo.Models;

namespace WebAppkendo.Controllers
{

    public class HomeController : Controller
    {
        private static readonly List<Rol> Roles = new List<Rol> {
            new Rol(1, "ADM", "Admin"),
            new Rol(2, "OPE", "Operador"),
            new Rol(3, "SUP", "Supervisor")
        };

        private static readonly List<Country> countries = new List<Country>{
                new Country { Id = 1000, Description = "Peru" },
                new Country { Id = 2000, Description = "Argentina" },
                new Country { Id = 3000, Description = "Colombia" },
            };

        private static List<Person> persons = new List<Person>();


        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            return View(new PersonViewModel
            {
                Person = new Person(),
                Roles = Roles
            });
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        [HttpPost]
        public JsonResult Search()
        {
            persons.ForEach(persona =>
            {
                var country = countries.FirstOrDefault(p => p.Id == persona.CountryId);
                if (country != null)
                {
                    persona.CountryDescription = country.Description;
                }
            });

            return Json(new
            {
                data = persons,
                total = persons.Count
            });
        }

        public JsonResult Create(Person person)
        {
            persons.Add(new Person(
                UUId: Guid.NewGuid().ToString(),
                name: person.Name,
                lastName: person.LastName,
                rolId: person.RolId,
                countryId: person.CountryId,
                active: person.Active,
                expireDate: person.ExpireDate,
                createdDate: DateTime.Now)
            );

            return Json(new
            {
                Success = true
            });
        }

        [HttpPost]
        public JsonResult Update(Person person)
        {
            var personStored = persons.FirstOrDefault(p => p.UUId == person.UUId);
            personStored.Update(person);

            return Json(new
            {
                Success = true
            });
        }

        [HttpPost]
        public JsonResult Delete(string uuid)
        {
            var personStored = persons.FirstOrDefault(p => p.UUId == uuid);
            if (personStored != null)
            {
                persons.Remove(personStored);
            }

            return Json(new
            {
                Success = true
            });
        }


        [HttpGet]
        public JsonResult Find(string uuid)
        {
            var personStored = persons.FirstOrDefault(p => p.UUId == uuid);

            var country = countries.FirstOrDefault(p => p.Id == personStored.CountryId);
            if (country != null)
            {
                personStored.CountryDescription = country.Description;
            }
            return Json(personStored, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetCountries(string criteria, int id, string nombre)
        {
            var data = countries.Where(p => p.Description.ToLower().Contains(criteria.Trim().ToLower())).ToList();
            return Json(data, JsonRequestBehavior.AllowGet);
        }
    }
}