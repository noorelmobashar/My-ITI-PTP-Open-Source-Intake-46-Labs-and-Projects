import jakarta.json.*;
import jakarta.json.stream.JsonGenerator;
import jakarta.json.stream.JsonParser;
import java.io.*;


public class Exercise1 {

    public static void main(String[] args) throws IOException {
        System.out.println("Object Model API");

        String fileName = "student_object.json";

        JsonObject jsonObject = Json.createObjectBuilder()
                .add("name", "Aya Amin")
                .add("age", 22)
                .build();

        JsonWriter writer = Json.createWriter(new FileWriter(fileName));
        writer.writeObject(jsonObject);
        writer.close();

        JsonReader reader = Json.createReader(new FileReader(fileName));
        JsonObject readObject = reader.readObject();

        String name = readObject.getString("name");
        int age = readObject.getInt("age");
        System.out.println("Name=" + name + ", Age=" + age);

        reader.close();

        System.out.println("Streaming API");

        String fileName2 = "student_stream.json";
        FileWriter fileWriter2 = new FileWriter(fileName2);
        JsonGenerator generator = Json.createGenerator(fileWriter2);
        generator.writeStartObject()
                .write("name", "Omar")
                .write("age", 24)
                .writeEnd();
        generator.close();

        JsonParser parser = Json.createParser(new FileReader(fileName2));
        while (parser.hasNext()) {
            JsonParser.Event event = parser.next();
            if (event == JsonParser.Event.KEY_NAME) {
                System.out.print(parser.getString() + "=");
            } else if (event == JsonParser.Event.VALUE_STRING || event == JsonParser.Event.VALUE_NUMBER) {
                System.out.print(parser.getString() + " ");
            }
        }
        parser.close();
        System.out.println();
    }
}