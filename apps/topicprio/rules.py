import rules

from adhocracy4.modules import predicates as module_predicates

rules.add_perm(
    "a4_candy_topicprio.add_topic", module_predicates.is_allowed_moderate_project
)

rules.add_perm(
    "a4_candy_topicprio.change_topic", module_predicates.is_allowed_moderate_project
)

rules.add_perm(
    "a4_candy_topicprio.view_topic",
    (
        module_predicates.is_allowed_moderate_project
        | module_predicates.is_allowed_view_item
    ),
)

rules.add_perm("a4_candy_topicprio.rate_topic", module_predicates.is_allowed_rate_item)

rules.add_perm(
    "a4_candy_topicprio.comment_topic", module_predicates.is_allowed_comment_item
)
