<?php

namespace App\Controller;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;
use function PHPUnit\Framework\never;

#[Route('/api', name:'api_')]
final class AuthController extends AbstractController
{
    #[Route('/register', name: 'register', methods:['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if(!is_array($data)) {
            return new JsonResponse([
                'message' => 'Invalid JSON data'
            ], Response::HTTP_BAD_REQUEST);
        }

        $email = $data["email"] ?? null;
        $firstName = $data["firstName"] ?? null;
        $lastName = $data["lastName"] ?? null;
        $password = $data["password"] ?? null;

        if (!$email || !$firstName || !$lastName || !$password) {
            return new JsonResponse([
                'message' => 'Missing required fields'
            ], Response::HTTP_BAD_REQUEST);
        }

        if($entityManager->getRepository(User::class)->findOneBy(['email' => $email])) {
            return new JsonResponse([
                'message' => 'Email already exists'
            ], Response::HTTP_CONFLICT);
        }

        $user = new User();
        $user->setEmail($email);
        $user->setFirstName($firstName);
        $user->setLastName($lastName);
        $user->setPassword($passwordHasher->hashPassword($user, $password));

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json([
            'message' => 'User registered successfully'
        ], Response::HTTP_CREATED);

    }
}
