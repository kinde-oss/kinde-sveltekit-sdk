import { expect, test } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const HOST = process.env.KINDE_ISSUER_URL || ""
const LOGIN_REDIRECT_URL = process.env.KINDE_POST_LOGIN_REDIRECT_URL || ""
const LOGOUT_REDIRECT_URL = process.env.KINDE_POST_LOGOUT_REDIRECT_URL || ""
const USER_EMAIL = process.env.KINDE_USER_EMAIL_TEST || ""
const USER_PASSWORD = process.env.KINDE_USER_PASSWORD_TEST || ""

test('Authentication Login', async ({ page }) => {
	await page.goto('api/auth/login');

	await page.waitForURL(new RegExp(`${HOST}/auth/cx/_:nav&m:login`))

	await page.getByLabel('Email').fill(USER_EMAIL);
	await page.getByText('Log in').click();
	await page.waitForTimeout(3000);
	await page.locator('#input_field_p_password_password').fill(USER_PASSWORD);
	await page.locator('[type="submit"]', {
		hasText: 'Continue'
	}).click();
	
	await expect(async () => {
		expect(page.url()).toContain(LOGIN_REDIRECT_URL);
	}).toPass();
});

test('Should redirect to registration page', async ({ page }) => {
	await page.goto('api/auth/register');

	await page.waitForURL(new RegExp(`${HOST}/auth/cx/_:nav&m:register`))

	await expect(page.locator('[name=p_first_name]')).toBeVisible()

	await expect(page.locator('[name=p_last_name]')).toBeVisible()

	await expect(page.locator('[name=p_email]')).toBeVisible()
});

test('Should redirect to create org page', async ({ page }) => {
	await page.goto('api/auth/create_org');

	await expect(page.locator('[name=p_first_name]')).toBeVisible()

	await expect(page.locator('[name=p_last_name]')).toBeVisible()

	await expect(page.locator('[name=p_email]')).toBeVisible()
});

test('Should redirect to logout page', async ({ page }) => {
	await page.goto('api/auth/logout');

	await expect(async () => {
		expect(page.url()).toContain(LOGOUT_REDIRECT_URL);
	}).toPass();
});