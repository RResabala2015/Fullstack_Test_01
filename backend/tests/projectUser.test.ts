import request from "supertest";
import app from "../src/app";
import { TEST_TOKEN, userId } from "./setupTestDB";
import Project from "../src/models/Project.model";
import ProjectUser from "../src/models/ProjectUser.model";

describe("ProjectUser Pivot (Collaborators) API", () => {
  let projectId: number;
  let collaboratorId: number;
  
  beforeAll(async () => {
    const userRes = await request(app)
        .post("/api/auth/register")
        .send({
        name: "Colaborador Test",
        email: "colab@test.com",
        password: "123456",
    });
    collaboratorId = userRes.body.user.id;

    const projectRes = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({
        name: "Proyecto con Colaboradores",
        description: "Test pivot",
    });
    projectId = projectRes.body.project.id;
  });

  test("POST /projects/add-collaborator debe agregar un colaborador", async () => {
    const res = await request(app)
      .post(`/api/projects/add-collaborator`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ 
        projectId : projectId,
        userId: collaboratorId
     });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Colaborador agregado");
  });

  test("POST /projects/add-collaborator NO debe permitir duplicados", async () => {
    const res = await request(app)
      .post(`/api/projects/add-collaborator`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send({ 
        projectId : projectId,
        userId: collaboratorId
     });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("El usuario ya es colaborador");
  });

  test("GET /projects/:id/collaborators debe listar colaboradores", async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}/collaborators`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.collaborators)).toBe(true);
    expect(res.body.collaborators.length).toBe(1);
    expect(res.body.collaborators[0].id).toBe(collaboratorId);
  });

  test("DELETE /projects/:projectId/collaborators/:userId debe eliminar colaborador", async () => {
    const res = await request(app)
      .delete(`/api/projects/${projectId}/collaborators/${collaboratorId}`)
      .set("Authorization", `Bearer ${TEST_TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Colaborador eliminado");

    const stillExists = await ProjectUser.findOne({
      where: { projectId, userId: collaboratorId },
    });

    expect(stillExists).toBeNull();
  });
});
