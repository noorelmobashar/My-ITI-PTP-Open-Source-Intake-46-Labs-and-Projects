import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { Card, Spinner, Alert, Badge } from "react-bootstrap";
import API from "../../api/axios";

export default function NoteDetails() {
    const { id } = useParams();

    const { data: note, isLoading, isError, error } = useQuery({
        queryKey: ["note", id],
        queryFn: () => API.get(`/notes/${id}`).then((res) => res.data.data),
    });

    if (isLoading) {
        return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    }

    if (isError) {
        return <Alert variant="danger">{error?.response?.data?.message || "Failed to load note"}</Alert>;
    }

    return (
        <Card className="mx-auto" style={{ maxWidth: "700px" }}>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <h3>{note.isPinned && "📌 "}{note.title}</h3>
                    <Badge bg={note.status === "published" ? "success" : note.status === "draft" ? "warning" : "secondary"}>
                        {note.status}
                    </Badge>
                </div>
                <div className="mb-3">
                    <Badge bg="info" className="me-1">{note.category}</Badge>
                    {note.tags?.map((tag, i) => (
                        <Badge bg="light" text="dark" className="me-1" key={i}>{tag}</Badge>
                    ))}
                </div>
                <div className="mb-4" style={{ whiteSpace: "pre-wrap" }}>
                    {note.content}
                </div>
                <small className="text-muted d-block mb-3">
                    Created: {new Date(note.createdAt).toLocaleString()} | Updated: {new Date(note.updatedAt).toLocaleString()}
                </small>
                <div className="d-flex gap-2">
                    <Link to={`/notes/${note._id}/edit`} className="btn btn-primary">Edit</Link>
                    <Link to="/notes" className="btn btn-outline-secondary">Back to Notes</Link>
                </div>
            </Card.Body>
        </Card>
    );
}
