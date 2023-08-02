# fall back in case of python 

import ratemyprofessor
import time

def getProfessor(school, professor_name):
  print(f"getting {professor_name}")
  return ratemyprofessor.get_professor_by_school_and_name(school, professor_name)

def getAllGivenProfessors(school_name, prof_array):
  # school 'id', 'name'
  data = {"school": {}, "instructors": []}
  school = ratemyprofessor.get_school_by_name(school_name)
  if not school:
     print(f"{school} not found")
     return data
  data["school"]["id"] = school.id
  data["school"]["namd"] = school.name
  # professor: 'courses', 'department', 'difficulty', 'get_ratings', 'id', 'name', 'num_ratings', 'rating', 'school', 'would_take_again'
  for professor in prof_array:
      professor_data = getProfessor(school, professor)
      professor_obj = {
         "name": professor_data.name,
         "department": professor_data.department,
         "rating": professor_data.rating,
         "name": professor_data.name,
         "name": professor_data.name,
         "name": professor_data.name,
         "name": professor_data.name,
      }
      data.append()
  return data

def main():
  school_name = "University of Maryland"
  prof_array = ["Fauzia Ali", "Fauzi Naas",  "Nelson Padua-Perez",  "Pedram Sadeghian", "Li Ma", "Lindsey Anderson", "Kimberli Munoz", "Todd Rowland", "Behtash Babadi", "Erin Molloy"]
  return getAllGivenProfessors(school_name, prof_array)

start = time.time()
data = main()
end = time.time()
print(f"{(end - start)} ")

