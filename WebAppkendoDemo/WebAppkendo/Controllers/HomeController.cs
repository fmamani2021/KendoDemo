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
        private static readonly List<Country> countries = new List<Country>{
                new Country { Id = 1000, Description = "Peru" },
                new Country { Id = 2000, Description = "Argentina" },
                new Country { Id = 3000, Description = "Colombia" },
            };


        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        [HttpGet]
        public JsonResult GetCountries(string criteria)
        {
            var data = countries.Where(p => criteria.Contains(p.Description)).ToList();
            return Json(data, JsonRequestBehavior.AllowGet);
        }
    }
}