import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Alert, Row, Col } from "react-bootstrap";
import API from "../../api/axios";

const schema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    category: z.string().optional(),
    tags: z.string().optional(),
    status: z.string().optional(),
    isPinned: z.boolean().optional(),
});

export default function CreateNote() {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            category: "personal",
            status: "draft",
            isPinned: false,
            tags: "",
        },
    });

    const mutation = useMutation({
        mutationFn: (data) => API.post("/notes", data),
        onSuccess: () => {
            navigate("/notes");
        },
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    return (
        <Card className="mx-auto" style={{ maxWidth: "700px" }}>
            <Card.Body>
                <h3 className="mb-4">Create Note</h3>
                {mutation.isError && (
                    <Alert variant="danger">{mutation.error?.response?.data?.message || "Something went wrong"}</Alert>
                )}
                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" {...register("title")} isInvalid={!!errors.title} />
                        <Form.Control.Feedback type="invalid">{errors.title?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Content</Form.Label>
                        <Form.Control as="textarea" rows={6} {...register("content")} isInvalid={!!errors.content} />
                        <Form.Control.Feedback type="invalid">{errors.content?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Select {...register("category")}>
                                    <option value="personal">Personal</option>
                                    <option value="work">Work</option>
                                    <option value="study">Study</option>
                                    <option value="other">Other</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select {...register("status")}>
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tags (comma separated)</Form.Label>
                                <Form.Control type="text" {...register("tags")} placeholder="react, node" />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Check type="checkbox" label="Pin this note" {...register("isPinned")} />
                    </Form.Group>
                    <div className="d-flex gap-2">
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? "Creating..." : "Create Note"}
                        </Button>
                        <Button variant="outline-secondary" onClick={() => navigate("/notes")}>Cancel</Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
}
