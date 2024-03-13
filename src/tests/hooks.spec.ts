import {sessionHooks} from '$lib/index.js';
import {describe, it, expect, vi} from 'vitest';

describe('Hooks', () => {
	describe('sessionHooks', () => {
		it('should add setSessionItem and getSessionItem methods to event.request', async () => {
			const event = {
				request: {},
				cookies: {
					set: vi.fn(),
					get: vi.fn().mockReturnValue('test value')
				}
			};

			await sessionHooks({event});

			expect(typeof event.request.setSessionItem).toBe('function');
			expect(typeof event.request.getSessionItem).toBe('function');
		});

		it('should set and get session items correctly', async () => {
			const event = {
				request: {},
				cookies: {
					set: vi.fn(),
					get: vi.fn().mockReturnValue('test value')
				}
			};
			await sessionHooks({event});

			await event.request.setSessionItem('testKey', 'testValue');
			const item = event.request.getSessionItem('testKey');

			expect(event.cookies.set).toHaveBeenCalledWith(
				'kinde_testKey',
				'testValue',
				expect.any(Object)
			);
			expect(item).toBe('test value');
		});
	});
});
