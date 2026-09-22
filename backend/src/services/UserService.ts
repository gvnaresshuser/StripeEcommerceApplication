import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/UserRepository.js";

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  mobile?: string;
}

interface LoginUserData {
  email: string;
  password: string;
}

export class UserService {
  private userRepository = new UserRepository();

  async registerUser(userData: RegisterUserData) {
    const { name, email, password, mobile } = userData;

    // 1. Check whether user already exists
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user
    const user = await this.userRepository.createUser({
      name,
      email,
      password: hashedPassword,
      mobile,
    });

    // 4. Never return password
    const { password: _, ...safeUser } = user;

    return safeUser;
  }

  async loginUser(loginData: LoginUserData) {
    const { email, password } = loginData;

    // 1. Find user
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // 2. Compare password with bcrypt hash
    const passwordMatches = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordMatches) {
      throw new Error("Invalid email or password");
    }

    // 3. Never return password
    const { password: _, ...safeUser } = user;

    return safeUser;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }

  async findById(id: number) {
    return await this.userRepository.findById(id);
  }
}