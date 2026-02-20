import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;


public class Exercise2 {

    public static void main(String[] args) {
        Jsonb jsonb = JsonbBuilder.create();

        System.out.println("Object to JSON and Vice Versa");

        Student student = null;
        String jsonString = jsonb.toJson(student);
        System.out.println(jsonString);

        Student deserializedStudent = jsonb.fromJson(jsonString, Student.class);
        System.out.println("Name=" + deserializedStudent.name + ", Age=" + deserializedStudent.age);


        System.out.println("\nArray to Object-Array and Vice Versa");

        Student[] studentsArray = new Student[]{
                new Student("Sara", 20),
                new Student("Ali", 22)
        };
        String jsonArrayString = jsonb.toJson(studentsArray);
        System.out.println(jsonArrayString);

        Student[] deserializedArray = jsonb.fromJson(jsonArrayString, Student[].class);
        for (Student s : deserializedArray) {
            System.out.print("{Name=" + s.name + ", Age=" + s.age + "} ");
        }
        System.out.println();
    }
}