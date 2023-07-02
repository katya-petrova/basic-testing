// Uncomment the code below and write your tests
import {
  BankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

const initialBalance = 100;

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const bankAccount = new BankAccount(initialBalance);
    expect(bankAccount.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const withdrawalAmount = 200;
    const bankAccount = new BankAccount(initialBalance);
    expect(() => bankAccount.withdraw(withdrawalAmount)).toThrowError(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const initialBalance1 = 100;
    const initialBalance2 = 50;
    const transferAmount = 200; // Amount greater than the initial balance
    const bankAccount1 = new BankAccount(initialBalance1);
    const bankAccount2 = new BankAccount(initialBalance2);

    expect(() =>
      bankAccount1.transfer(transferAmount, bankAccount2),
    ).toThrowError(InsufficientFundsError);
    expect(bankAccount1.getBalance()).toBe(initialBalance1);
    expect(bankAccount2.getBalance()).toBe(initialBalance2);
  });
});

test('should throw error when transferring to the same account', () => {
  const transferAmount = 50;
  const bankAccount = new BankAccount(initialBalance);

  expect(() => bankAccount.transfer(transferAmount, bankAccount)).toThrowError(
    TransferFailedError,
  );
  expect(bankAccount.getBalance()).toBe(initialBalance);
});

test('should deposit money', () => {
  const depositAmount = 50;
  const bankAccount = new BankAccount(initialBalance);

  bankAccount.deposit(depositAmount);
  expect(bankAccount.getBalance()).toBe(initialBalance + depositAmount);
});

test('should withdraw money', () => {
  const withdrawalAmount = 50;
  const bankAccount = new BankAccount(initialBalance);

  bankAccount.withdraw(withdrawalAmount);
  expect(bankAccount.getBalance()).toBe(initialBalance - withdrawalAmount);
});

test('should transfer money', () => {
  const initialBalance1 = 100;
  const initialBalance2 = 50;
  const transferAmount = 50;
  const bankAccount1 = new BankAccount(initialBalance1);
  const bankAccount2 = new BankAccount(initialBalance2);

  bankAccount1.transfer(transferAmount, bankAccount2);
  expect(bankAccount1.getBalance()).toBe(initialBalance1 - transferAmount);
  expect(bankAccount2.getBalance()).toBe(initialBalance2 + transferAmount);
});

test('fetchBalance should return number in case if request did not failed', async () => {
  const bankAccount = new BankAccount(initialBalance);
  const fetchBalance = jest
    .spyOn(bankAccount, 'fetchBalance')
    .mockResolvedValue(80);

  const result = await bankAccount.fetchBalance();
  expect(fetchBalance).toHaveBeenCalled();
  expect(typeof result).toBe('number');
});

test('should set new balance if fetchBalance returned number', async () => {
  const bankAccount = new BankAccount(initialBalance);
  const fetchBalance = jest
    .spyOn(bankAccount, 'fetchBalance')
    .mockResolvedValue(80);

  await bankAccount.synchronizeBalance();
  expect(fetchBalance).toHaveBeenCalled();
  expect(bankAccount.getBalance()).toBe(80);
});

test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
  const bankAccount = new BankAccount(initialBalance);
  const fetchBalance = jest
    .spyOn(bankAccount, 'fetchBalance')
    .mockResolvedValue(null);

  await expect(bankAccount.synchronizeBalance()).rejects.toThrowError(
    SynchronizationFailedError,
  );
  expect(fetchBalance).toHaveBeenCalled();
});
