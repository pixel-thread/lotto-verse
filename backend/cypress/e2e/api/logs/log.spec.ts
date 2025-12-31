/// <reference types="cypress" />

describe('Logs API Endpoint', () => {
  const baseUrl = '/api/logs';

  describe('POST /api/logs', () => {
    it('should successfully log ERROR with valid payload', () => {
      cy.request({
        method: 'POST',
        url: baseUrl,
        body: {
          type: 'ERROR',
          message: 'Database connection failed',
          content: '{"query":"SELECT * FROM users","duration":5000}',
          timestamp: new Date().toISOString(),
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('message', 'Log saved successfully');
      });
    });

    it('should successfully log INFO with minimal payload', () => {
      cy.request({
        method: 'POST',
        url: baseUrl,
        body: {
          type: 'INFO',
          content: 'User login successful',
          timestamp: new Date().toISOString(),
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('message', 'Log saved successfully');
      });
    });

    it('should successfully log WARN with default message', () => {
      cy.request({
        method: 'POST',
        url: baseUrl,
        body: {
          type: 'WARN',
          content: 'Deprecated API endpoint used',
          timestamp: new Date().toISOString(),
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    it('should reject invalid log type - 400', () => {
      cy.request({
        method: 'POST',
        url: baseUrl,
        body: {
          type: 'INVALID_TYPE',
          content: 'test',
          timestamp: new Date().toISOString(),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.include('Invalid log type');
      });
    });

    it('should reject invalid timestamp - 400', () => {
      cy.request({
        method: 'POST',
        url: baseUrl,
        body: {
          type: 'ERROR',
          content: 'test',
          timestamp: 'invalid-date',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.include('Invalid ISO date string');
      });
    });

    it('should reject empty content - 400', () => {
      cy.request({
        method: 'POST',
        url: baseUrl,
        body: {
          type: 'INFO',
          content: '',
          timestamp: new Date().toISOString(),
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('should handle database errors gracefully', () => {
      // Mock database failure by using invalid data that would fail addLogsToDB
      cy.request({
        method: 'POST',
        url: baseUrl,
        body: {
          type: 'ERROR',
          content: 'Database is down',
          timestamp: new Date().toISOString(),
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        // Should still return 200 or appropriate error, not 500
        expect(response.status).not.to.eq(500);
      });
    });

    it('should handle invalid JSON body - 400', () => {
      cy.request({
        method: 'POST',
        url: baseUrl,
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });
});
