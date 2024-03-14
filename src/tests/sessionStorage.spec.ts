import {describe, beforeEach, expect, it} from 'vitest';
import {sessionStorage} from '../lib/sessionStorage/index.js';
import {type SessionManager} from '@kinde-oss/kinde-typescript-sdk';

describe('SessionStorage', () => {
	describe('setSessionItem', () => {
		it('should set item in session storage', () => {
			// Arrange
			const key = 'testKey';
			const value = 'testValue';

			// Act
			sessionStorage.setSessionItem(key, value);

			// Assert
			expect(sessionStorage.getSessionItem(key)).toEqual(value);
		});

		it('should set non-string item in session storage', () => {
			// Arrange
			const key = 'testKey';
			const value = {a: 1};

			// Act
			sessionStorage.setSessionItem(key, value);

			// Assert
			expect(sessionStorage.getSessionItem(key)).toEqual(value);
		});
	});

	describe('getSessionItem', () => {
		it('should get item from session storage', () => {
			// Arrange
			const key = 'testKey';
			const value = 'testValue';
			sessionStorage.setSessionItem(key, value);

			// Act
			const retrievedValue = sessionStorage.getSessionItem(key);

			// Assert
			expect(retrievedValue).toEqual(value);
		});
	});

	describe('removeSessionItem', () => {
		it('should remove item from session storage', () => {
			// Arrange
			const key = 'testKey';
			const value = 'testValue';
			sessionStorage.setSessionItem(key, value);

			// Act
			sessionStorage.removeSessionItem(key);

			// Assert
			const retrievedValue = sessionStorage.getSessionItem(key);
			expect(retrievedValue).toBeUndefined();
		});
	});

	describe('destroySession', () => {
		it('should destroy the session', () => {
			// Arrange
			const key1 = 'testKey1';
			const value1 = 'testValue1';
			const key2 = 'testKey2';
			const value2 = 'testValue2';
			sessionStorage.setSessionItem(key1, value1);
			sessionStorage.setSessionItem(key2, value2);

			// Act
			sessionStorage.destroySession();

			// Assert
			const retrievedValue1 = sessionStorage.getSessionItem(key1);
			const retrievedValue2 = sessionStorage.getSessionItem(key2);
			expect(retrievedValue1).toBeUndefined();
			expect(retrievedValue2).toBeUndefined();
		});
	});
});
