<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class AuthMeController extends AbstractController
{
    #[Route('/api/me', name: 'api_me')]
    public function __invoke(): JsonResponse
    {
        $suser = $this->getUser();

        if (!$suser) {
            return new JsonResponse(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        return new JsonResponse([
            'id' => $suser->getId(),
            'username' => $suser->getUsername(),
            'email' => $suser->getEmail(),
            'roles' => $suser->getRoles(),
        ]);
    }
}
