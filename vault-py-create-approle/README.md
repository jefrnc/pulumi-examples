[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/jefrnc)

# vault-py-create-approle

This is a Pulumi stack that demonstrates how to use the Vault AppRole to authenticate Jenkins with Vault.

## Prerequisites

- Pulumi CLI (https://www.pulumi.com/docs/get-started/install/)
- HashiCorp Vault (https://www.vaultproject.io/docs/install)
  
## Configuration

```ssh
export VAULT_ADDRESS=<VAULT_ADDRESS>
export VAULT_TOKEN=<VAULT_TOKEN>
```

## Execution

Deploy the Pulumi stack:

```ssh
pulumi up
````

## Retrieve the role ID and secret ID from Vault

```ssh
role_name="jenkins-dev-role"
role_id=$(curl --header "X-Vault-Token: $VAULT_TOKEN" $VAULT_ADDR/v1/auth/approle/role/$role_name/role-id  | jq -r .data.role_id)
secret_id=$(curl --header "X-Vault-Token: $VAULT_TOKEN" --request POST $VAULT_ADDR/v1/auth/approle/role/$role_name/secret-id | jq -r .data.secret_id)

echo "role_id: $role_id"
echo "secret_id: $secret_id"
```

##  Buy me a coffee ☕

If you enjoy my content and would like to support me and keep my enthusiasm and motivation going, you can buy me a coffee ☕️ as a token of appreciation.

Don't worry if you're unable to make a donation; my content will always be free and available to everyone. However, if you'd like to support me in other ways, here are a few options:

- Follow my GitHub profile: You can show your support by following my GitHub profile. It would mean a lot to me and help me reach a wider audience.
- Star this repository: If you find this repository useful, consider giving it a star. It helps others discover the repository and encourages me to continue creating helpful content.
- Even these small gestures of support go a long way, and I truly appreciate them!

Donations:
- [MercadoPago](https://mpago.la/2Bkj3aR)
- Cryptocurrencies: You can make a donation in cryptocurrencies through my Binance wallet. If you don't have a Binance account, you can create one https://accounts.binance.com/register?ref=CKPN0JOY. Binance Pay ID `223466477` or Binance User `Josfranco`.

I appreciate any donation you can make, and I hope you enjoy my content!

---
⌨️ with ❤️ by [jefrnc](https://github.com/jefrnc) 😊