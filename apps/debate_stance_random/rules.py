import rules

from adhocracy4.modules import predicates as module_predicates

rules.add_perm(
    'a4_candy_debate_stance_random.add_stancerandomsubject',
    module_predicates.is_allowed_moderate_project
)

rules.add_perm(
    'a4_candy_debate_stance_random.change_stancerandomsubject',
    module_predicates.is_allowed_moderate_project
)

rules.add_perm(
    'a4_candy_debate_stance_random.view_stancerandomsubject',
    (module_predicates.is_allowed_moderate_project |
     module_predicates.is_allowed_view_item)
)

rules.add_perm(
    'a4_candy_debate_stance_random.comment_stancerandomsubject',
    module_predicates.is_allowed_comment_item
)
