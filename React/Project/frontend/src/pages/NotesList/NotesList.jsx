import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col, Spinner, Alert, Form, Button, Badge, Modal, InputGroup } from "react-bootstrap";
import API from "../../api/axios";

export default function NotesList() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [order, setOrder] = useState("desc");
    const [page, setPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const limit = 6;

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const queryParams = new URLSearchParams();
    queryParams.set("page", page);
    queryParams.set("limit", limit);
    if (debouncedSearch) queryParams.set("search", debouncedSearch);
    if (category) queryParams.set("category", category);
    if (status) queryParams.set("status", status);
    if (sortBy) queryParams.set("sortBy", sortBy);
    if (order) queryParams.set("order", order);

    const { data, isLoading, isFetching, isError, error } = useQuery({
        queryKey: ["notes", { page, debouncedSearch, category, status, sortBy, order }],
        queryFn: () => API.get(`/notes?${queryParams.toString()}`).then((res) => res.data.data),
        placeholderData: keepPreviousData,
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => API.delete(`/notes/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            setShowDeleteModal(false);
            setNoteToDelete(null);
        },
    });

    const confirmDelete = (note) => {
        setNoteToDelete(note);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (noteToDelete) {
            deleteMutation.mutate(noteToDelete._id);
        }
    };

    const notes = data?.notes || [];
    const totalPages = data?.totalPages || 1;

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Notes {isFetching && <Spinner size="sm" animation="border" className="ms-2" />}</h2>
                <Link to="/notes/create" className="btn btn-primary">+ New Note</Link>
            </div>

            <Row className="g-3 mb-4">
                <Col md={4}>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Search notes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={2}>
                    <Form.Select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
                        <option value="">All Categories</option>
                        <option value="personal">Personal</option>
                        <option value="work">Work</option>
                        <option value="study">Study</option>
                        <option value="other">Other</option>
                    </Form.Select>
                </Col>
                <Col md={2}>
                    <Form.Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
                        <option value="">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </Form.Select>
                </Col>
                <Col md={2}>
                    <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="createdAt">Date Created</option>
                        <option value="updatedAt">Date Updated</option>
                        <option value="title">Title</option>
                    </Form.Select>
                </Col>
                <Col md={2}>
                    <Form.Select value={order} onChange={(e) => setOrder(e.target.value)}>
                        <option value="desc">Newest</option>
                        <option value="asc">Oldest</option>
                    </Form.Select>
                </Col>
            </Row>

            {isLoading && !data ? (
                <div className="text-center mt-5"><Spinner animation="border" /></div>
            ) : isError ? (
                <Alert variant="danger">{error?.response?.data?.message || "Failed to load notes"}</Alert>
            ) : notes.length === 0 ? (
                <Alert variant="info">No notes found. Create your first note!</Alert>
            ) : (
                <Row className="g-3" style={{ opacity: isFetching ? 0.7 : 1, transition: "opacity 0.2s" }}>
                    {notes.map((note) => (
                        <Col md={6} lg={4} key={note._id}>
                            <Card className="h-100">
                                <Card.Body className="d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <Card.Title className="mb-0" style={{ fontSize: "1rem" }}>
                                            {note.isPinned && "📌 "}{note.title}
                                        </Card.Title>
                                        <Badge bg={note.status === "published" ? "success" : note.status === "draft" ? "warning" : "secondary"}>
                                            {note.status}
                                        </Badge>
                                    </div>
                                    <Card.Text className="text-muted small flex-grow-1" style={{ overflow: "hidden", maxHeight: "60px" }}>
                                        {note.content}
                                    </Card.Text>
                                    <div className="mb-2">
                                        <Badge bg="info" className="me-1">{note.category}</Badge>
                                        {note.tags?.map((tag, i) => (
                                            <Badge bg="light" text="dark" className="me-1" key={i}>{tag}</Badge>
                                        ))}
                                    </div>
                                    <div className="d-flex gap-2 mt-auto">
                                        <Link to={`/notes/${note._id}`} className="btn btn-sm btn-outline-primary">View</Link>
                                        <Link to={`/notes/${note._id}/edit`} className="btn btn-sm btn-outline-secondary">Edit</Link>
                                        <Button size="sm" variant="outline-danger" onClick={() => confirmDelete(note)}>Delete</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {totalPages > 1 && (
                <div className="d-flex justify-content-center gap-2 mt-4">
                    <Button variant="outline-primary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                    <span className="align-self-center">Page {page} of {totalPages}</span>
                    <Button variant="outline-primary" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
                </div>
            )}

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete "{noteToDelete?.title}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete} disabled={deleteMutation.isPending}>
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
