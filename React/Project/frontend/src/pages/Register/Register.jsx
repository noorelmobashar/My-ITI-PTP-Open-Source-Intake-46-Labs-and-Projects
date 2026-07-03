import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Card, Alert } from "react-bootstrap";
import API from "../../api/axios";

const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const mutation = useMutation({
        mutationFn: (data) => API.post("/auth/register", data),
        onSuccess: (res) => {
            dispatch(setCredentials({ token: res.data.data.token }));
            navigate("/dashboard");
        },
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    return (
        <Card className="mx-auto mt-5" style={{ maxWidth: "450px" }}>
            <Card.Body>
                <h3 className="mb-4">Register</h3>
                {mutation.isError && (
                    <Alert variant="danger">{mutation.error?.response?.data?.message || "Something went wrong"}</Alert>
                )}
                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" {...register("name")} isInvalid={!!errors.name} />
                        <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" {...register("email")} isInvalid={!!errors.email} />
                        <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" {...register("password")} isInvalid={!!errors.password} />
                        <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Button type="submit" className="w-100" disabled={mutation.isPending}>
                        {mutation.isPending ? "Registering..." : "Register"}
                    </Button>
                </Form>
                <p className="mt-3 text-center">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </Card.Body>
        </Card>
    );
}
