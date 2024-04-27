const GameModel = require("../../models/game.model").GameModel;
const UserModel = require("../../models/user.model").UserModel;
const ScoreboardModel = require("../../models/scoreboard.model").ScoreboardModel;
const supertest = require('supertest');
const app = require('../../app');
const sinon = require('sinon');

describe("Pruebas de integracion de la API", function() {
    describe("Deberá contener un registro de usuarios que registre el nombre, dicho servicio deberá devolver un identificador del usuario para utilizarlo en los siguientes servicios", function() {
        it.skip("Crear usuario", function(done) {
            const usuario = {
                userName: "Penedos"
            };
            supertest(app)
                .post('/users/')
                .send(usuario)
                .expect(201)
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
        });

        it.skip('No debería aceptar nombres con caracteres especiales', async () => {
            const response = await supertest(app)
                .post('/users/')
                .send({ userName: 'Joaqui%n$us%' })
                .expect(500);
            expect(response.body.error).toBeDefined();
        });
    });

    describe("Deberá tener un servicio jugar donde se le envié como parámetros el id del usuario y una palabra, la cual iniciará el juego", () => {
        let clock;

        beforeAll(() => {
            clock = sinon.useFakeTimers();
        });

        afterAll(() => {
            clock.restore();
        });

        it.skip('Deberá tener una prueba de integración que valide el envío del id del usuario y una palabra, la cual solo deberá contener letras', async () => {
            clock.tick(19000);
            const response = await supertest(app)
                .post('/game/play')
                .send({ userId: "662b09d8f99a8bbf71f16897", word: "Amsterdam" });

            expect(response.status).toBe(200); // Verifica que el código de estado HTTP es 200
            expect(["Correct! Continue playing.", "Time's up! Game over."]).toContain(response.body.message);
            if (response.body.message === "Correct! Continue playing.") {
                expect(response.body.game).toBeDefined();
            }
        });

        it.skip('should only accept words containing letters', async () => {
            const response = await supertest(app)
                .post('/game/play')
                .send({ userId: "6626d63c0a19c34820c5f13f", word: "111" })
                .expect(400);

            expect(response.body.message).toBe("Invalid word! Game over.");
        });

        it.skip('Deberá validar la respuesta del servicio en el juego en curso, es decir que siempre que el juego siga en curso devuelva una palabra', async () => {
            const response = await supertest(app)
                .post('/game/play')
                .send({ userId: "6626d63c0a19c34820c5f13f", word: "obo" })
                .expect(200);

            expect(response.body.message).toBe("Correct! Continue playing.");
            expect(response.body.game).toBeDefined();
            expect(response.body.game.currentWord).toBeDefined();
        });
    });

    describe("Deberá tener una función que obtenga la última letra de la palabra enviada como parámetro", () => {
        it.skip('Deberá tener una prueba de integración que valide el envío del id del usuario y una palabra, la cual solo deberá contener letras', async () => {
            const response = await supertest(app)
                .post('/game/play')
                .send({ userId: "6626d63c0a19c34820c5f13f", word: "obo" })
                .expect(200);

            expect(response.body.message).toBe("Correct! Continue playing.");
            expect(response.body.game).toBeDefined();
        });

        it.skip('should only accept words containing letters', async () => {
            const response = await supertest(app)
                .post('/game/play')
                .send({ userId: "6626d63c0a19c34820c5f13f", word: "111" })
                .expect(400);

            expect(response.body.message).toBe("Invalid word! Game over.");
        });
    });
});
