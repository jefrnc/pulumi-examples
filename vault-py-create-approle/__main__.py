import pulumi
import pulumi_vault as vault

# Vault policy content
jenkins_policy = '''
    path "/secrets/*" {
        capabilities = ["read", "list"]
    }
    path "app_config/*/*/devops/*/application/*" {
        capabilities = ["read", "list"]
    }
'''
# Create a vault.Policy resource
jenkins_vault_policy = vault.Policy("jenkins-policy", policy = jenkins_policy)

# Create an AppRole with the Jenkins policy attached
jenkins_app_role = vault.approle.AuthBackendRole(
    "jenkins-role-test",
    role_name="jenkins-dev-role",
    token_policies=[jenkins_vault_policy.name],
    token_ttl=3600,
    token_max_ttl=36000,
)

# Generate a SecretID for the AppRole
role_secret_id = vault.approle.AuthBackendRoleSecretId(
    "jenkins-role-secret-dev",
    role_name=jenkins_app_role.role_name,
)

# Export the role ID
pulumi.export("jenkinsRoleID", jenkins_app_role.role_id)